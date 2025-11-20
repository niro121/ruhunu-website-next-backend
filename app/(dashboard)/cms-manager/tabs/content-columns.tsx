"use client";

import { CustomDialog } from "@/components/common/custom-dialog";
import { CircleCorrect, CircleX } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Section } from "@/types/section";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ContentRecordAction from "./content-record-actions";
import HeroForm from "./hero-Form";
import TextOnlyForm from "./text-only-form";
import TextTextForm from "./text-text-form";
import TextMediaForm from "./text-media-form";
import MediaOnlyForm from "./media-only-form";
import MediaMediaForm from "./media-media-form";
import ExtraLargeTextForm from "./extra-large-text-form";
import SpacerForm from "./spacer-form";
import AwardForm from "./award-form";
import BannerForm from "./banner-form";
import BoradOfDirectorsForm from "./borad-0f-directors-form";
import CaouselForm from "./caousel-form";
import AccordionForm from "./accordion-form";
import MediaForm from "./media-form";
import PopUpForm from "./popup-form";
import MapForm from "./map-form";
import DocumentsForm from "./documents-form";

const sectionForms: Record<string, React.FC<any>> = {
    "Hero": HeroForm,
    "Text Only" : TextOnlyForm,
    "Text-Text" : TextTextForm,
    "Text-Media" : TextMediaForm,
    "Media Only" : MediaOnlyForm,
    "Media-Media" : MediaMediaForm,
    "Extra Large Text" : ExtraLargeTextForm,
    "Spacer" : SpacerForm,
    "Award" : AwardForm,
    "Banner" : BannerForm,
    "Borad Of Directors" : BoradOfDirectorsForm,
    "Caousel" : CaouselForm,
    "Accordion" : AccordionForm,
    "Documents" : DocumentsForm,  
    "Media" : MediaForm,
    "PopUp" : PopUpForm,
    "Map" : MapForm,
};



function ContentColumnsTitleCell({
    content,
    sessionRole,
    currentPageId,
    styleClasses,
    onChange,
}: {
    content: any;
    sessionRole: string | undefined;
    currentPageId: string | undefined;
    styleClasses?: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
    onChange?: () => void;
}) {

    const defaultStyleClasses = styleClasses ?? { parentDiv: '', labelClassName: '', inputClassName: '' };

    const renderForm = () => {
        switch (content.type) {
            case "Text Only":
                return <TextOnlyForm 
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Text-Text':
                return <TextTextForm 
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />
            case 'Text-Media':
                return <TextMediaForm 
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Media Only':
                return <MediaOnlyForm 
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Media-Media':
                return <MediaMediaForm 
                    pageId={currentPageId || ''}
                    content={content} 
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Extra Large Text':
                return <ExtraLargeTextForm 
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Spacer':
                return <SpacerForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Award':
                return <AwardForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Banner':
                return <BannerForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Borad Of Directors':
                return <BoradOfDirectorsForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Caousel':
                return <CaouselForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Accordion':
                return <AccordionForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Documents':
                return <DocumentsForm
                    pageId={currentPageId || ''} 
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Media':
                return <MediaForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'PopUp':
                return <PopUpForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Map':
                return <MapForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            default:
                return null;
        }
    }

    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="text-blue-600 hover:underline"
                onClick={() => setOpen(true)}
            >
                {content.type}
            </button>

            <CustomDialog
                open={open}
                setOpen={setOpen}
                title={`Edit ${content.type}`}
                width="800px"
            >
                {renderForm()}
            </CustomDialog>
        </>
    );
}

export const contentColumns = (props?: {
    onChange?: () => void;
    currentPageId: string | undefined;
    sessionRole: string | undefined;
    styleClasses: {
        parentDiv: string;
        labelClassName: string;
        inputClassName: string;
    };
}): ColumnDef<Section>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
                }
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <ContentColumnsTitleCell
                content={row.original}
                sessionRole={props?.sessionRole}
                currentPageId={props?.currentPageId}
                onChange={props?.onChange} 
                styleClasses={props?.styleClasses}
            />
        ),
    },
    {
        accessorKey: "data.title",
        header: "Title",
    },
    {
        accessorKey: "order",
        header: "Order",
    },
    {
        accessorKey: "layout",
        header: "Layout",
    },
    {
        accessorKey: "visibility",
        header: "Visibility",
        cell: ({ row }) => {
            const show = row.getValue("visibility");
            return show === true ? (
                <CircleCorrect className="text-green-500 w-7 h-7" />
            ) : (
                <CircleX className="text-red-500 w-7 h-7" />
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ContentRecordAction row={row} onChange={props?.onChange ?? (() => {})}  />,
    },
];
