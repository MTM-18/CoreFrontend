import { FaMagnifyingGlass } from "react-icons/fa6";
import SelectMenu, { type SelectOption } from "./SelectMenu";

export default function SearchFilterBar({
    search,
    onSearch,
    searchPlaceholder,
    filter,
    onFilter,
    filterPlaceholder,
    options,
}: {
    search: string;
    onSearch: (value: string) => void;
    searchPlaceholder: string;
    filter: string;
    onFilter: (value: string) => void;
    filterPlaceholder: string;
    options: SelectOption[];
}) {
    return (
        <div className="mt-8 grid gap-3 sm:grid-cols-[minmax(0,1fr)_15rem]">
            <label className="flex min-h-12 items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-5 text-white shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-xl transition focus-within:border-core-accent/55">
                <FaMagnifyingGlass className="shrink-0 text-sm text-core-accent" />
                <input
                    type="search"
                    value={search}
                    onChange={(event) => onSearch(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
                />
            </label>
            <SelectMenu value={filter} options={options} onChange={onFilter} placeholder={filterPlaceholder} />
        </div>
    );
}
