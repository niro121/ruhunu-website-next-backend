"use client";

import { CustomDialog } from "@/components/common/custom-dialog";
import { CircleCorrect, CircleX } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Section } from "@/types/section";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import ContentRecordAction from "./content-record-actions";

import HeroForm from "./hero-Form";
import TextOnlyForm from "./forms/text-only-form";
import TextTextForm from "./forms/text-text-form";
import TextMediaForm from "./forms/text-media-form";
import MediaOnlyForm from "./forms/media-only-form";
import MediaMediaForm from "./forms/media-media-form";
import ExtraLargeTextForm from "./forms/extra-large-text-form";
import SpacerForm from "./forms/spacer-form";
import AwardForm from "./forms/award-form";
import BannerForm from "./forms/banner-form";
import BoradOfDirectorsForm from "./forms/borad-0f-directors-form";
import CaouselForm from "./forms/caousel-form";
import AccordionForm from "./forms/accordion-form";
import MediaForm from "./forms/media-form";
import PopUpForm from "./forms/popup-form";
import MapForm from "./forms/map-form";
import DocumentsForm from "./forms/documents-form";
import ServicesForm from "./forms/services-form";
import TestimonialsForm from "./forms/testimonials-form";
import FacebookYoubuteForm from "./forms/facebook-youtube-section-form";
import ContactForm from "./forms/contact-form";
import PdfViwerForm from "./forms/pdf-viewer-form";
import GalleryForm from "./forms/gallery-form";
import EventsForm from "./forms/event-form";
import NTSApplicationForm from "./forms/nts-application-form";
import RmaSectionForm from "./forms/RMA-section-form";
import ContactDetailsForm from "./forms/contact-details-section-form";
import ConsultantForm from "./forms/our-consultant-form";
import VacancyTableForm from "./forms/vacancy-table-form";

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
    "Contact-Banner" : ContactDetailsForm,
    "Borad Of Directors" : BoradOfDirectorsForm,
    "Caousel" : CaouselForm,
    "Accordion" : AccordionForm,
    "Our Consultant" : ConsultantForm,
    "Documents" : DocumentsForm,  
    "Media" : MediaForm,
    "PopUp" : PopUpForm,
    "Map" : MapForm,
    "Gallery" : GalleryForm,
    "Services" : ServicesForm,
    "Events" : EventsForm,
    "Testimonials" : TestimonialsForm,
    "Contact Form" : ContactForm,
    "NTSApplication Form" : NTSApplicationForm,
    "RmaSection Form" : RmaSectionForm,
    "Pdf Viwer" : PdfViwerForm,
    "Vacancy List" : VacancyTableForm, 
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
            case 'Contact-Banner':
                return <ContactDetailsForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />
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
            case 'Our Consultant': 
                return <ConsultantForm
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

            case 'Gallery':
                return <GalleryForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;

            case 'Services':
                return <ServicesForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;

            case 'Events':
                return <EventsForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;

            case 'Testimonials':
                return <TestimonialsForm
                    pageId={currentPageId || ''}
                    content={content}
                    sessionRole={sessionRole} 
                    styleClasses={styleClasses || defaultStyleClasses} 
                    onUpdated={onChange ?? (() => {})}
                />;
            case 'Facebook-Youtube':
                return <FacebookYoubuteForm 
                    pageId={currentPageId || ''} 
                    content={content}
                    sessionRole={sessionRole}
                    styleClasses={styleClasses || defaultStyleClasses}
                    onUpdated={onChange ?? (() => {})}
                />

            case 'NTSApplication':
                return <NTSApplicationForm 
                    pageId={currentPageId || ''} 
                    content={content}
                    sessionRole={sessionRole}
                    styleClasses={styleClasses || defaultStyleClasses}
                    onUpdated={onChange ?? (() => {})}
                />

            case 'Contact':
                return <ContactForm 
                    pageId={currentPageId || ''} 
                    content={content}
                    sessionRole={sessionRole}
                    styleClasses={styleClasses || defaultStyleClasses}
                    onUpdated={onChange ?? (() => {})}
                />

            case 'RmaSection':
                return <RmaSectionForm 
                    pageId={currentPageId || ''} 
                    content={content}
                    sessionRole={sessionRole}
                    styleClasses={styleClasses || defaultStyleClasses}
                    onUpdated={onChange ?? (() => {})}
                />

            case 'PdfViwer':
                return <PdfViwerForm
                    pageId={currentPageId || ''} 
                    content={content}
                    sessionRole={sessionRole}
                    styleClasses={styleClasses || defaultStyleClasses}
                    onUpdated={onChange ?? (() => {})}
                />

            case 'Vacancy List':
                return <VacancyTableForm
                    pageId={currentPageId || ''} 
                    content={content}
                    sessionRole={sessionRole}
                    styleClasses={styleClasses || defaultStyleClasses}
                    onUpdated={onChange ?? (() => {})}
                />

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
