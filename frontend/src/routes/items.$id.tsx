import { getItem, itemQueryOptions } from "@/lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/items/$id")({
	loader: ({ params: { id } }) => getItem(id),
	component: ItemComponent,
});

function ItemComponent() {
	const { id } = Route.useParams();
	const { data } = useSuspenseQuery(itemQueryOptions(id));
	const { item } = data;
	return (
		<div>
			<div className="flex flex-col py-8 px-4">{item?.description}</div>
		</div>
	);
}
