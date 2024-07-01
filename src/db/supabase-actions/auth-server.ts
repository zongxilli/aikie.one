/* eslint-disable no-console */
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// import { createUserStore } from '@/stores/user';

import { createClient } from '../../../supabase/server';

// const userStore = createUserStore();

export async function login(formData: FormData) {
	const supabase = createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
	};

	const {
		// data: { user },
		error,
	} = await supabase.auth.signInWithPassword(data);

	if (error) {
		redirect('/error');
	}

	// if (user) {
	// 	await userStore.getState().loadCurrentUser(user.id);
	// }

	revalidatePath('/', 'layout');
	redirect('/');
}

export async function signup(formData: FormData) {
	const supabase = createClient();

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const firstName = formData.get('first-name') as string;
	const lastName = formData.get('last-name') as string;
	const data = {
		email: formData.get('email') as string,
		password: formData.get('password') as string,
		options: {
			data: {
				name: `${firstName + ' ' + lastName}`,
				email: formData.get('email') as string,
				full_name: `${firstName + ' ' + lastName}`, // for supabase authentication table to add it to display_name
			},
		},
	};

	const { data: signUpData, error } = await supabase.auth.signUp(data);

	if (error) {
		console.log(error);
		redirect('/error');
	}

	return signUpData;

	// revalidatePath('/', 'layout');
	// redirect('/');
}

export async function signout() {
	const supabase = createClient();
	const { error } = await supabase.auth.signOut();
	if (error) {
		console.log(error);
		redirect('/error');
	}

	redirect('/logout');
}

export async function signInWithGoogle() {
	const supabase = createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'google',
		options: {
			queryParams: {
				access_type: 'offline',
				prompt: 'consent',
			},
		},
	});
	console.log(data);

	if (error) {
		console.log(error);
		redirect('/error');
	}

	redirect(data.url);
}

export async function signInWithGitHub() {
	const supabase = createClient();
	const { data, error } = await supabase.auth.signInWithOAuth({
		provider: 'github',
	});

	console.log(data);

	if (error) {
		console.log(error);
		redirect('/error');
	}

	redirect(data.url);
}

export async function signInWithMagicLink(email: string) {
	const supabase = createClient();

	if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		console.log('Invalid email format');
		redirect('/error?message=Invalid email format');
	}

	const { error } = await supabase.auth.signInWithOtp({
		email: email,
		options: {
			// 可以自定义邮件内容
			emailRedirectTo: `${process.env.NEXT_APP_URL}/home`,
		},
	});

	if (error) {
		console.log('Error sending magic link:', error);
		redirect('/error?message=Error sending magic link');
	}
}
