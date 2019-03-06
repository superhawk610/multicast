export async function authMiddleware(resolve, root, args, context, info) {
  if (!context.user.token) {
    throw new Error('You must be logged in.');
  }
  return await resolve(root, args, context, info);
}
