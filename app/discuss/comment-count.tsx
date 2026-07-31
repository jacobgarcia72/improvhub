import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CommentCount({ count }: { count: number }) {
    return (
        <div className="text-sm flex flex-row px-2 py-1 text-mist-600 dark:text-mist-400">
            <FontAwesomeIcon icon={faMessage} />
            <div className="mt-[-3px] ml-[3px]">
                {count}
            </div>
        </div>
    );
}
