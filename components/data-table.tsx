import { cn } from "@/lib/utils";

type Column<T> = {
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
};

export function DataTable<T>({ data, columns }: { data: T[]; columns: Column<T>[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className={cn("px-4 py-3 font-semibold", column.className)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <tr key={index} className="text-slate-700">
                {columns.map((column) => (
                  <td key={column.header} className={cn("px-4 py-3", column.className)}>
                    {column.cell(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
