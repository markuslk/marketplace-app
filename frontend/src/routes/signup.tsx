import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
	beforeLoad: async ({ context }) => {
		if (context.user) {
			throw redirect({
				to: "/",
			});
		}
	},
	component: SignUpPage,
});

function SignUpPage() {
	const navigate = useNavigate();
	const form = useForm({
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			console.log(value);
			try {
				const res = await fetch("/api/signup", {
					method: "POST",
					body: JSON.stringify(value),
				});
				if (res.ok) {
					toast("Success", {
						description: "User created",
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
		<>
			<div>Hello /signup!</div>
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Sign Up</CardTitle>
					<CardDescription>Enter your information to create an account</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}>
						<div className="grid gap-4">
							<div className="grid grid-cols-1 gap-4">
								<div className="grid gap-2">
									<form.Field
										name="username"
										children={(field) => (
											<>
												<Label htmlFor={field.name}>Username</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onChange={(e) => field.handleChange(e.target.value)}
													onBlur={field.handleBlur}
													placeholder="Max"
													type="text"
													required
												/>
											</>
										)}
									/>
								</div>
								{/* <div className="grid gap-2">
								<Label htmlFor="last-name">Last name</Label>
								<Input id="last-name" placeholder="Robinson" required />
							</div> */}
							</div>
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
							<Button type="submit" className="w-full">
								Create an account
							</Button>
						</div>
					</form>
					<div className="mt-4 text-center text-sm">
						Already have an account?{" "}
						<Link href="/login" className="underline">
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
