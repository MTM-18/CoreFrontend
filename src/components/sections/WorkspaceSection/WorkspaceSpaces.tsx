import { useTranslation } from "react-i18next";

import { useCmsItems } from "../../../cms/useCmsItems";
import sharedImg from "../../../assets/display/5.webp";
import meetingImg from "../../../assets/display/W3.webp";
import trainingImg from "../../../assets/display/3.webp";
import officesImg from "../../../assets/display/W5.webp";
import cafeImg from "../../../assets/display/coworking.webp";

type SpaceId = "shared" | "meeting" | "training" | "offices" | "cafe";

type Space = {
    id: SpaceId;
    image: string;
    tagKeys: string[];
};

const SPACES: Space[] = [
    {
        id: "shared",
        image: sharedImg,
        tagKeys: [
            "highSpeedInternet",
            "creativeSpaces",
            "hotDrinks",
            "laserPrinting",
        ],
    },
    {
        id: "meeting",
        image: meetingImg,
        tagKeys: [
            "bigTv",
            "laserPrinting",
            "whiteboard",
        ],
    },
    {
        id: "training",
        image: trainingImg,
        tagKeys: [
            "bigTv",
            "laserPrinting",
            "whiteboard",
        ],
    },
    {
        id: "offices",
        image: officesImg,
        tagKeys: [
            "technicalSupport",
            "laserPrinting",
            "whiteboard",
            "logisticalSupport",
            "highSpeedInternet",
        ],
    },
    {
        id: "cafe",
        image: cafeImg,
        tagKeys: [
            "hotColdDrinks",
            "snacks",
            "youthFriendly",
        ],
    },
];

export default function WorkspaceSpaces() {
    const { t } = useTranslation();
    const cmsImages = useCmsItems("workspace_images");
    const imageBySpace = new Map(
        cmsImages
            .filter((item) => item.program && item.image_path)
            .map((item) => [item.program as SpaceId, item.image_path]),
    );

    return (
        <section className="layout-shell py-16 md:py-20">
            <div className="max-w-6xl mx-auto space-y-10">
                {SPACES.map((space, index) => {
                    const isImageLeft = index % 2 === 0;

                    const imageEl = (
                        <div className="w-full">
                            <img
                                src={imageBySpace.get(space.id) || space.image}
                                alt={t(`workspacePage.spaces.${space.id}.imgAlt`)}
                                className="w-full rounded-xl object-cover shadow-md"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    );

                    const textEl = (
                        <div className="card-surface rounded-xl p-6 md:p-7 flex flex-col justify-between h-full">
                            <div>
                                <h3 className="text-xl md:text-2xl font-semibold mb-2 text-core-brand dark:text-core-textAccent">
                                    {t(`workspacePage.spaces.${space.id}.title`)}
                                </h3>
                                <p className="text-sm md:text-base text-core-textDark dark:text-core-textLight leading-relaxed">
                                    {t(`workspacePage.spaces.${space.id}.description`)}
                                </p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {space.tagKeys.map((tagKey) => (
                                    <span
                                        key={tagKey}
                                        className="
                      inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm
                      border border-core-border/60
                      bg-core-surfaceAlt dark:bg-core-surfaceAltDark
                      text-core-textMuted dark:text-core-textMutedDark
                    "
                                    >
                                        {t(`workspacePage.spaces.tags.${tagKey}`)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );

                    return (
                        <div
                            key={space.id}
                            className="grid gap-6 md:grid-cols-2 items-stretch"
                        >
                            {isImageLeft ? (
                                <>
                                    {imageEl}
                                    {textEl}
                                </>
                            ) : (
                                <>
                                    {textEl}
                                    {imageEl}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
