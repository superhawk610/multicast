import { validateToken } from '../services/auth.service';

const excludedResolvers = ['validateLogin'];

export async function authMiddleware(resolve, root, args, context, info) {
  const excluded = context.authorized || excludedResolvers.find(r => r === info.fieldName);
  const isAuthenticated = context.user && context.user.token && validateToken(context.user.token);

  if (!excluded && !isAuthenticated) {
    throw new Error('401: You must be logged in.');
  }

  return await resolve(root, args, { ...context, authorized: true }, info);
}
