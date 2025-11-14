'use client';

import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, PlusCircle } from 'lucide-react';
import { contentColumns } from './content-columns';
import { Section } from '@/types/section';
import { useRouter } from 'next/navigation';
import { bulkDeleteSection, getAllSection } from '@/app/actions/section.actions';
import Loading from '../../loading';
import { CustomDataTable } from '@/components/common/custom-data-table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import TextOnlyForm from './textOnly-form';
import { CustomDialog } from '@/components/common/custom-dialog';
import TextMediaForm from './textMedia-form';

type ContentTableProps = {
    currentPageId: string | undefined;
    searchParams?: {
        page?: string;
        limit?: string;
        keyword?: string;
    };
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    sessionRole: string | undefined;
};

export default function ContentTable({
    currentPageId,
    styleClasses,
    searchParams,
    sessionRole,
}: ContentTableProps) {
    const router = useRouter();

    const [data, setData] = useState<Section[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const fetchData = async () => {
        if (!currentPageId) return;

        setLoading(true);
        try {
            const res = await getAllSection(currentPageId);
            setData(
                res.data
                ? res.data.map((item) => ({
                    ...item,
                    data: (item.data ?? {}) as Record<string, any>,
                    }))
                : []
            );
        } catch (error) {
            console.error('Error fetching sections:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPageId]);

    const sectionTypes = [
        'Text Only',
        'Text-Text',
        'Text-Media',
        'Media Only',
        'Media-Media',
        'Extra Large Text',
        'Spacer',
        'Award',
        'Banner',
        'Borad Of Directors',
        'Caousel',
        'Accordion',
        'Documents',  
        'Media',
        'PopUp',
        'Map',
    ];

    const handleSelectType = (type: string) => {
        setSelectedType(type); // open popup
    };

    const handleClosePopup = () => {
        setSelectedType(null);
        fetchData();
    };

    // Different popup content based on selected type
    const renderFormContent = () => {
        switch (selectedType) {
            case 'Text Only':
                return <TextOnlyForm 
                    pageId={currentPageId || ''} 
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={function (page: any): void {}}
                />;
            case 'Text-Text':
                return <></>
            case 'Text-Media':
                return <TextMediaForm 
                    pageId={currentPageId || ''} 
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={function (page: any): void {}}
                />;
            case 'Media Only':
                return <></>;
            case 'Media-Media':
                return <></>;
            case 'Extra Large Text':
                return <></>;
            case 'Spacer':
                return <></>;
            case 'Award':
                return <></>;
            case 'Banner':
                return <></>;
            case 'Borad Of Directors':
                return <></>;
            case 'Caousel':
                return <></>;
            case 'Accordion':
                return <></>;
            case 'Documents':
                return <></>;
            case 'Media':
                return <></>;
            case 'PopUp':
                return <></>;
            case 'Map':
                return <></>;
            default:
                return null;
        }
    };

    return (
        <div className="overflow-hidden">
            {/* Dropdown Button */}
            <div className="flex justify-end items-center mb-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    className="flex items-center gap-2 text-white border border-black bg-black hover:text-black hover:bg-transparent"
                    size="sm"
                >
                    <PlusCircle size={16} />
                    Add Section
                    <ChevronDown size={16} />
                </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48 bg-white h-93">
                    {sectionTypes.map((type) => (
                        <DropdownMenuItem
                            key={type}
                            onClick={() => handleSelectType(type)}
                            className='hover:bg-black hover:text-white'
                        >
                            {type}
                        </DropdownMenuItem>
                    ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Table */}
            <div>
                <Suspense fallback={<Loading />}>
                    <CustomDataTable
                        heading="Contents"
                        subHeading="Manage your content here."
                        columns={contentColumns({
                            onChange: fetchData,
                            sessionRole,
                            currentPageId,
                        })}
                        data={data}
                        rowCount={totalRecords}
                        deleteServerAction={bulkDeleteSection}
                        page={searchParams?.page}
                    />
                </Suspense>
            </div>

            {/* Popup (Modal) */}
            <CustomDialog open={!!selectedType} setOpen={handleClosePopup} title={`Add ${selectedType}`} width="800px">
                <div className="mt-4 space-y-4">{renderFormContent()}</div>
            </CustomDialog>
        </div>
    );
}
