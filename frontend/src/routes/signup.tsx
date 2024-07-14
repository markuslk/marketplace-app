import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
	component: SignUpPage,
});

function SignUpPage() {
	return (
		<>
			<div>Hello /signup!</div>
			<Card className="mx-auto max-w-sm">
				<CardHeader>
					<CardTitle className="text-xl">Sign Up</CardTitle>
					<CardDescription>Enter your information to create an account</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<div className="grid grid-cols-1 gap-4">
							<div className="grid gap-2">
								<Label htmlFor="username">Username</Label>
								<Input id="username" placeholder="Max" required />
							</div>
							{/* <div className="grid gap-2">
								<Label htmlFor="last-name">Last name</Label>
								<Input id="last-name" placeholder="Robinson" required />
							</div> */}
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="m@example.com" required />
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" />
						</div>
						<Button type="submit" className="w-full">
							Create an account
						</Button>
					</div>
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
