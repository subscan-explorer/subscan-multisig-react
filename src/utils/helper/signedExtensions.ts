import type { ApiPromise } from '@polkadot/api';
import type { SiLookupTypeId } from '@polkadot/types/interfaces';
import { allExtensions } from '@polkadot/types/extrinsic/signedExtensions';
import type { ExtDef, ExtTypes } from '@polkadot/types/extrinsic/signedExtensions/types';
import { getSiName } from '@polkadot/types/metadata/util';
import type { Registry } from '@polkadot/types/types';

/**
 * Extrinsic v4 has no extension-version byte. Polkadot.js always signs that
 * format and hardcodes transaction-extension version 0, but it still lists
 * every extension from metadata and then drops the ones it does not know.
 * On Asset Hub Paseo, version 0 includes AsPgas, AsDotnsGateway and
 * RestrictOrigins. Dropping them makes `TransactionPaymentApi_query_info`
 * trap. On Asset Hub Polkadot those same extensions belong to version 1,
 * which v4 does not encode — adding them traps a chain that already worked.
 * Keep version 0, in its metadata order, and fill unknown extras from metadata
 * so the SCALE default (None / false) is written. Known extensions keep the
 * built-in field names (`era`, `nonce`, `tip`, `mode`) the signer fills in.
 * Polkadot.js signs with its own registry and drops unknown extensions, so the
 * same definitions are sent through `metadata.provide` before signing.
 */
export function chainUserSignedExtensions(api: ApiPromise): ExtDef {
  const registry = api.registry;
  const extrinsic = registry.metadata.extrinsic;
  const extensions = extrinsic.transactionExtensions;
  const names = extensionNamesForVersion(extrinsic, 0);

  if (!extensions?.length || !names.length) {
    return {};
  }

  const included = new Set(names);
  const usedExtrinsic = new Set<string>();
  const usedPayload = new Set<string>();

  names.forEach((name) => {
    const known = allExtensions[name];

    if (!known) {
      return;
    }

    Object.keys(known.extrinsic).forEach((key) => usedExtrinsic.add(key));
    Object.keys(known.payload).forEach((key) => usedPayload.add(key));
  });

  const user: ExtDef = {};

  extensions.forEach((entry) => {
    const identifier = entry.identifier.toString();

    if (!included.has(identifier) || allExtensions[identifier]) {
      return;
    }

    try {
      user[identifier] = {
        extrinsic: fieldsFromType(registry, entry.type, identifier, usedExtrinsic),
        payload: fieldsFromType(registry, entry.implicit, `${identifier}Implicit`, usedPayload),
      };
    } catch (error) {
      console.error(`Failed to read signed extension ${identifier}`, error);
    }
  });

  return user;
}

// eslint-disable-next-line complexity
export function installChainSignedExtensions(api: ApiPromise): void {
  try {
    const registry = api.registry;
    const names = extensionNamesForVersion(registry.metadata.extrinsic, 0);
    const user = chainUserSignedExtensions(api);

    if (!names.length) {
      return;
    }

    const unchanged =
      Object.keys(user).length === 0 &&
      names.length === registry.signedExtensions.length &&
      names.every((name, index) => name === registry.signedExtensions[index]);

    if (unchanged) {
      return;
    }

    registry.setSignedExtensions(names, user);
  } catch (error) {
    console.error('Failed to register chain signed extensions', error);
  }
}

function extensionNamesForVersion(extrinsic: Registry['metadata']['extrinsic'], version: number): string[] {
  const names: string[] = [];

  extrinsic.transactionExtensionsByVersion.forEach((indexes, key) => {
    if (key.toNumber() !== version) {
      return;
    }

    indexes.forEach((index) => {
      const entry = extrinsic.transactionExtensions[index.toNumber()];

      if (entry) {
        names.push(entry.identifier.toString());
      }
    });
  });

  return names;
}

function camel(name: string): string {
  const snake = name.replace(/_([a-zA-Z0-9])/g, (_, char: string) => char.toUpperCase());

  return snake.charAt(0).toLowerCase() + snake.slice(1);
}

function claim(used: Set<string>, key: string): string {
  const base = key || 'ext';

  if (!used.has(base)) {
    used.add(base);

    return base;
  }

  let index = 2;

  while (used.has(`${base}${index}`)) {
    index += 1;
  }

  const next = `${base}${index}`;

  used.add(next);

  return next;
}

function fieldsFromType(registry: Registry, typeId: SiLookupTypeId, identifier: string, used: Set<string>): ExtTypes {
  const lookup = registry.lookup;
  const def = lookup.getSiType(typeId).def;
  const fields: ExtTypes = {};

  if (def.isTuple) {
    const tuple = def.asTuple;

    if (tuple.length === 0) {
      return fields;
    }

    tuple.forEach((inner, index) => {
      const key = tuple.length === 1 ? camel(identifier) : `${camel(identifier)}${index}`;

      fields[claim(used, key)] = getSiName(lookup, inner);
    });

    return fields;
  }

  if (def.isComposite) {
    const composite = def.asComposite.fields;

    if (composite.length === 0) {
      return fields;
    }

    composite.forEach((field, index) => {
      const raw = field.name.toString();
      const key = raw ? camel(raw) : composite.length === 1 ? camel(identifier) : `${camel(identifier)}${index}`;

      fields[claim(used, key)] = getSiName(lookup, field.type);
    });

    return fields;
  }

  fields[claim(used, camel(identifier))] = getSiName(lookup, typeId);

  return fields;
}
