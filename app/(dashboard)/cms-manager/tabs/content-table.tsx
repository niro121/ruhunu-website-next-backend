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
import TextOnlyForm from './forms/text-only-form';
import { CustomDialog } from '@/components/common/custom-dialog';
import TextMediaForm from './forms/text-media-form';
import TextTextForm from './forms/text-text-form';
import MediaOnlyForm from './forms/media-only-form';
import MediaMediaForm from './forms/media-media-form';
import ExtraLargeTextForm from './forms/extra-large-text-form';
import SpacerForm from './forms/spacer-form';
import AwardForm from './forms/award-form';
import BannerForm from './forms/banner-form';
import BoradOfDirectorsForm from './forms/borad-0f-directors-form';
import CaouselForm from './forms/caousel-form';
import AccordionForm from './forms/accordion-form';
import DocumentsForm from './forms/documents-form';
import MediaForm from './forms/media-form';
import PopUpForm from './forms/popup-form';
import MapForm from './forms/map-form';
import ServicesForm from './forms/services-form';
import TestimonialsForm from './forms/testimonials-form';

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
        'Services',
        'Testimonials'
    ];

    const handleSelectType = (type: string) => {
        setSelectedType(type); // open popup
    };

    const handleBulkDelete = async (ids: string[]): Promise<boolean> => {
        try {
            await bulkDeleteSection(ids);
            await fetchData();
            return true;
        } catch (error) {
            console.error("Bulk delete failed:", error);
            return false;
        }
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
                    content={null}
                    sessionRole={sessionRole}
                    styleClasses={styleClasses}
                    onUpdated={fetchData} 
                />;
            case 'Text-Text':
                return <TextTextForm 
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />
            case 'Text-Media':
                return <TextMediaForm 
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Media Only':
                return <MediaOnlyForm 
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Media-Media':
                return <MediaMediaForm 
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Extra Large Text':
                return <ExtraLargeTextForm 
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Spacer':
                return <SpacerForm
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Award':
                return <AwardForm
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Banner':
                return <BannerForm
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Borad Of Directors':
                return <BoradOfDirectorsForm
                    pageId={currentPageId || ''} 
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Caousel':
                return <CaouselForm
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Accordion':
                return <AccordionForm
                    pageId={currentPageId || ''} 
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Documents':
                return <DocumentsForm
                    pageId={currentPageId || ''} 
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Media':
                return <MediaForm
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'PopUp':
                return <PopUpForm
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Map':
                return <MapForm
                    pageId={currentPageId || ''} 
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Services':
                return <ServicesForm
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
            case 'Testimonials':
                return <TestimonialsForm
                    pageId={currentPageId || ''}
                    content={null}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses} 
                    onUpdated={fetchData}
                />;
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
                            styleClasses,
                        })}
                        data={data}
                        rowCount={totalRecords}
                        deleteServerAction={handleBulkDelete}
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
