
describe('First test: ', () => {
  test('Should be true if pass boolean', () => {
    // Arrange
    const testVar = true;

    // Action
    const result = typeof testVar;

    // Assert
    expect(result).toBe('boolean');
  });
});
