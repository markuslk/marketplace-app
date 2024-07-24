import { Button, buttonVariants } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { userQueryOptions } from "@/lib/api";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { UserId } from "lucia";
import { toast } from "sonner";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

interface MyRouterContext {
	queryClient: QueryClient;
}
type User = {
	id: UserId;
	username: string;
	email: string;
} | null;

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		const queryClient = context.queryClient;
		try {
			const data = await queryClient.fetchQuery(userQueryOptions);
			return data;
		} catch (err) {
			return { user: null };
		}
	},
	component: RootComponent,
});

function RootComponent() {
	const { user } = Route.useRouteContext();
	return (
		<div className="max-w-screen-2xl mx-auto flex flex-col min-h-screen">
			<main className="flex-1">
				<Header user={user} />
				<hr />
				<Outlet />
				<Toaster />
				<TanStackRouterDevtools initialIsOpen={false} />
			</main>
		</div>
	);
}

function Header({ user }: { user: User }) {
	const navigate = useNavigate();
	return (
		<header className="h-12">
			<nav className="flex h-full w-full items-center justify-between gap-2 px-2">
				<a href="/" className="text-base font-semibold sm:text-xl">
					FastAFMarketplace
				</a>
				{user ? (
					<div className="flex items-center gap-4">
						<Link>My offers</Link>
						<Link>My auctions</Link>
						<h5>Welcome, {user.username}</h5>
						<Button
							onClick={async () => {
								await fetch("/api/logout", {
									method: "POST",
								});
								toast("Success", {
									description: "Logged out",
								});
								navigate({ to: "/" });
							}}
							className={buttonVariants({
								variant: "outline",
								size: "sm",
								className: "text-primary",
							})}>
							Log out
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<Link to="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
							Login
						</Link>
						<Link to="/signup" className={buttonVariants({ variant: "default", size: "sm" })}>
							Sign Up
						</Link>
					</div>
				)}
			</nav>
		</header>
	);
}
