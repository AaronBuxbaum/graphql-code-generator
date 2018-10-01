import gqlTag from 'graphql-tag';
import { toFragmentName } from './to-fragment-name';
import { Operation } from 'graphql-codegen-core';

export function gql(operation: Operation, options: Handlebars.HelperOptions): string {
  const config = options.data.root.config || {};

  const doc = `
    ${operation.document}
    ${includeFragments(transformFragments(operation.document, options))}
  `;

  return config.noGraphqlTag ? JSON.stringify(gqlTag(doc)) : 'gql`' + doc + '`';
}

function includeFragments(fragments: string[]): string {
  if (fragments) {
    return `
      ${fragments
        .filter((name, i, all) => all.indexOf(name) === i)
        .map(name => '${' + name + '}')
        .join('\n')}
    `;
  }

  return '';
}

export function extractFragments(document: string): string[] | undefined {
  return (document.match(/\.\.\.[a-z0-9\_]+/gi) || []).map(name => name.replace('...', ''));
}

function transformFragments(document: string, options: Handlebars.HelperOptions): string[] | undefined {
  return extractFragments(document).map(document => toFragmentName(document, options));
}
