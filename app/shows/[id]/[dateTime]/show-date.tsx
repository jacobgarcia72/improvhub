import { formatDateTimeForDisplay } from "@/lib/dates";

export default function ShowDate({ showDate }: {showDate: string}) {
    return (
        <h3 className="font-semibold font-lg pt-2 pb-0">{`Show Date: ${formatDateTimeForDisplay(showDate)}`}</h3>
    )
}