export async function fallbackMiddleware(resolve, root, args, context, info) {
  throw new Error('Fallback server is active, please check your configuration.');
}
