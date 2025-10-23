"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/common/custom-dialog";
import { CustomDataTable } from "@/components/common/custom-data-table";
import { menuItemColumns } from "./menu-item-columns";
import { bulkDeleteMenuItems, getAllMenuItems, getNextMenuItemOrder } from "@/app/actions/menuitem.actions";
import { PlusCircle } from "@/components/icons";
import MenuItemForm from "./menu-item-form";
import Loading from "../../loading";
import { MenuItem } from "@/types/menu-items";
import { getNextOrder } from "@/lib/utils/totalRecordCount";

type MenuItemTableProps = {
  currentMenuId?: string | undefined;
  searchParams?: {
    page?: string;
    limit?: string;
    keyword?: string;
  };
  sessionRole: string | undefined;
};

export default function MenuItemTable({
  currentMenuId,
  searchParams,
  sessionRole,
}: MenuItemTableProps) {
  const router = useRouter();
  const [data, setData] = useState<MenuItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    if (!currentMenuId) return;

    console.log({currentMenuId})

    setLoading(true);
    try {
      const res = await getAllMenuItems({
        currentMenuId,
        page: searchParams?.page,
        limit: searchParams?.limit,
        keyword: searchParams?.keyword,
      });
      setData(res.data ?? []);
      setTotalRecords(res.totalRecords ?? 0);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMenuId, searchParams]);

  return (
    <>
      <div className="ml-auto flex justify-end items-center gap-4 mb-5">
        <Button
          size="sm"
          variant="outline"
          className="w-full sm:w-24 gap-1 border-red-500 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
          type="button"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => setOpen(true)}
          className="gap-1 px-8 text-white bg-[#01012A] border hover:text-[#01012A] hover:bg-white hover:border"
          disabled={loading}
        >
          <PlusCircle />
          Add New
        </Button>

        <CustomDialog open={open} setOpen={setOpen} title="Add New Menu Item">
          <MenuItemForm
            menuItem={null}
            sessionRole={sessionRole}
            currentMenuId={currentMenuId || ""}
            onChange={fetchData}
          />
        </CustomDialog>
      </div>

      <div className="overflow-hidden">
        <Suspense fallback={<Loading />}>
          <CustomDataTable
            heading="Menu Items"
            subHeading="Manage your menu items here."
            columns={menuItemColumns({
              onChange: fetchData,
              sessionRole: sessionRole,
              currentMenuId: currentMenuId
            })}
            data={data}
            rowCount={totalRecords}
            deleteServerAction={bulkDeleteMenuItems}
            page={searchParams?.page}
          />
        </Suspense>
      </div>
    </>
  );
}
