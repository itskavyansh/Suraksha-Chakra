import { describe, it, expect } from 'vitest';
import { RouteObject } from 'react-router-dom';
import { ROUTES } from './routes';
import { DEFINED_ROUTE_PATTERNS, routeConfig } from './router';

// Recursively extract all paths from routeConfig
function extractPaths(routes: RouteObject[]): string[] {
  const paths: string[] = [];
  for (const r of routes) {
    if (r.path && r.path !== '*') {
      paths.push(r.path);
    }
    if (r.children) {
      paths.push(...extractPaths(r.children));
    }
  }
  return paths;
}

// Convert a path pattern like /training/:id to a RegExp
function patternToRegex(pattern: string): RegExp {
  const escaped = pattern.replace(/:[a-zA-Z0-9_]+/g, '[^/]+');
  return new RegExp(`^${escaped}$`);
}

describe('ROUTES config and Router integration', () => {
  const allRouterPaths = extractPaths(routeConfig);

  it('ensures every path in routeConfig matches DEFINED_ROUTE_PATTERNS', () => {
    for (const path of allRouterPaths) {
      expect(
        (DEFINED_ROUTE_PATTERNS as readonly string[]).includes(path),
        `Path ${path} in routeConfig must be in DEFINED_ROUTE_PATTERNS`
      ).toBe(true);
    }
  });

  it('ensures every static route in ROUTES matches a defined route pattern', () => {
    const staticKeys: (keyof typeof ROUTES)[] = [
      'landing',
      'login',
      'signup',
      'forgotPin',
      'home',
      'scan',
      'hurt',
      'hurtLog',
      'priceCheck',
      'guide',
      'training',
      'jobs',
      'earnings',
      'recyclers',
      'profile',
      'admin',
      'eval',
    ];

    for (const key of staticKeys) {
      const path = ROUTES[key] as string;
      const matched = allRouterPaths.some((pattern) => {
        const regex = patternToRegex(pattern);
        return regex.test(path);
      });
      expect(matched, `Route ${key} (${path}) should match a defined router pattern`).toBe(true);
    }
  });

  it('ensures every parameterized route in ROUTES matches a defined router pattern', () => {
    const parameterizedChecks = [
      { call: ROUTES.hurtType('needle'), expectedPattern: '/hurt/:type' },
      { call: ROUTES.guideCategory('sharps'), expectedPattern: '/guide/:category' },
      { call: ROUTES.trainingDetail('mod-1'), expectedPattern: '/training/:id' },
      { call: ROUTES.verify('SC-DEL-000142'), expectedPattern: '/verify/:workerId' },
    ];

    for (const { call, expectedPattern } of parameterizedChecks) {
      const regex = patternToRegex(expectedPattern);
      expect(regex.test(call), `Call ${call} should match ${expectedPattern}`).toBe(true);
      expect(allRouterPaths).toContain(expectedPattern);
    }
  });

  it('ensures all defined router patterns are unique (no collisions)', () => {
    const uniquePatterns = new Set(allRouterPaths);
    expect(uniquePatterns.size).toBe(allRouterPaths.length);
  });
});
