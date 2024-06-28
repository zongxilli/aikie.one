import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value,
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value,
						...options,
					});
				},
				remove(name: string, options: CookieOptions) {
					request.cookies.set({
						name,
						value: '',
						...options,
					});
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					});
					response.cookies.set({
						name,
						value: '',
						...options,
					});
				},
			},
		}
	);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// 定义需要保护的路由
	const protectedRoutes = ['/home'];

	// 检查当前路径是否需要保护
	const isProtectedRoute = protectedRoutes.some((route) =>
		request.nextUrl.pathname.startsWith(route)
	);

	// 特殊处理根路径
	// const isRootPath = request.nextUrl.pathname === '/';

	// 如果是受保护的路由（包括根路径）且用户未登录，重定向到登录页面
	if (isProtectedRoute && !user) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// 如果用户已登录且尝试访问登录或注册页面，重定向到首页
	if (
		user &&
		(request.nextUrl.pathname === '/login' ||
			request.nextUrl.pathname === '/signup')
	) {
		return NextResponse.redirect(new URL('/home', request.url));
	}

	return response;
}
