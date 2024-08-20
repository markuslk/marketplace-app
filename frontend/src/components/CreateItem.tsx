import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createItem } from "@/lib/api";
import { createItemSchema } from "@server/shared-types";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { itemsQueryOptions } from "@/lib/api";

const CreateItem = () => {
	const [open, setOpen] = useState<boolean>(false);
	const queryClient = useQueryClient();
	const form = useForm({
		validatorAdapter: zodValidator(),
		defaultValues: {
			title: "",
			description: "",
			startingPrice: "",
			buyNowPrice: "",
		},
		onSubmit: async ({ value }) => {
			try {
				const newItem = await createItem({ value });

				toast("New item created", {
					description: `Succressfully created new item ${newItem.title} with starting price - ${newItem.startingPrice}€ and buy now price - ${newItem.buyNowPrice}€`,
				});
				setOpen((prev) => !prev);
				queryClient.refetchQueries({
					queryKey: itemsQueryOptions.queryKey,
					exact: true,
				});
			} catch (error) {
				toast("Error", {
					description: `Failed to create new item - ${error}`,
				});
			}
		},
	});
	return (
		<Dialog open={open} onOpenChange={() => setOpen(!open)}>
			<DialogTrigger asChild>
				<Button variant="default">Add Item</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}>
					<DialogHeader>
						<DialogTitle>Add Item</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. Click save when you're done.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<form.Field
								name="title"
								validators={{
									onChange: createItemSchema.shape.title,
								}}
								children={(field) => {
									return (
										<>
											<Label htmlFor={field.name} className="text-right">
												Title
											</Label>
											<Input
												id={field.name}
												type="text"
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="What would you like to sell?"
												className="col-span-3"
											/>
										</>
									);
								}}
							/>
							<form.Field
								name="description"
								validators={{
									onChange: createItemSchema.shape.description,
								}}
								children={(field) => {
									return (
										<>
											<Label htmlFor={field.name} className="text-right">
												Description
											</Label>
											<Input
												id={field.name}
												type="text"
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Describe what you are selling?"
												className="col-span-3"
											/>
										</>
									);
								}}
							/>
							<form.Field
								name="startingPrice"
								validators={{
									onChange: createItemSchema.shape.startingPrice,
								}}
								children={(field) => {
									return (
										<>
											<Label htmlFor={field.name} className="text-right">
												Starting Price
											</Label>
											<Input
												id={field.name}
												type="text"
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="What is the starting price for this item?"
												className="col-span-3"
											/>
										</>
									);
								}}
							/>
							<form.Field
								name="buyNowPrice"
								validators={{
									onChange: createItemSchema.shape.buyNowPrice,
								}}
								children={(field) => {
									return (
										<>
											<Label htmlFor={field.name} className="text-right">
												Buy now Price
											</Label>
											<Input
												id={field.name}
												type="text"
												name={field.name}
												value={field.state.value}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="What is the starting price for this item?"
												className="col-span-3"
											/>
										</>
									);
								}}
							/>
						</div>
					</div>
					<DialogFooter>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<Button type="submit" variant={"default"} disabled={!canSubmit}>
									{isSubmitting ? "Adding item" : "Create item"}
								</Button>
							)}
						/>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
export default CreateItem;
