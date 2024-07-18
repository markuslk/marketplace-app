import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		if (context.user) {
			throw redirect({
				to: "/",
			});
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			try {
				const res = await fetch("/api/login", {
					method: "POST",
					body: JSON.stringify(value),
				});
				if (res.ok) {
					toast("Success", {
						description: "Logged in",
					});
					navigate({ to: "/" });
				}
			} catch (err) {
				toast("Error", {
					description: `Error = ${err}`,
				});
			}
		},
	});
	return (
		<div>
			<div>Hello /login!</div>
			<Card className="mx-auto w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>Enter your email below to login to your account.</CardDescription>
				</CardHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}>
					<CardContent className="grid gap-4">
						<div className="grid gap-2">
							<form.Field
								name="email"
								children={(field) => (
									<>
										<Label htmlFor={field.name}>Email</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											type="email"
											placeholder="m@example.com"
											required
										/>
									</>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<form.Field
								name="password"
								children={(field) => (
									<>
										<Label htmlFor={field.name}>Password</Label>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
											type="password"
											required
										/>
									</>
								)}
							/>
						</div>
					</CardContent>
					<CardFooter className="grid">
						<Button type="submit" className="w-full">
							Sign in
						</Button>
						<div className="mt-4 text-center text-sm">
							Don&apos;t have an account?{" "}
							<Link href="/signup" className="underline">
								Sign up
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
