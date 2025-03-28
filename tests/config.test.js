import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { isPathAllowed } from '../src/config/validation.js';

describe('Configuration validation', () => {
  const allowedPaths = ['/allowed/path', '/another/allowed/path'];
  
  it('should allow paths that start with allowed paths', () => {
    assert.strictEqual(isPathAllowed('/allowed/path/subdir', allowedPaths), true);
    assert.strictEqual(isPathAllowed('/another/allowed/path/file.txt', allowedPaths), true);
  });
  
  it('should reject paths that do not start with allowed paths', () => {
    assert.strictEqual(isPathAllowed('/not/allowed', allowedPaths), false);
    assert.strictEqual(isPathAllowed('/allowed', allowedPaths), false); // Must match full path segment
  });
  
  it('should normalize path separators', () => {
    assert.strictEqual(isPathAllowed('/allowed/path\\subdir', allowedPaths), true);
  });
});
