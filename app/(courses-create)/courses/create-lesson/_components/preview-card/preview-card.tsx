import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect } from "react";
import CustomPopover from "@/components/shared/custom-popover/custom-popover";
import { EditIcon2 } from "@/assets/icons/EditIcon";
import { TrashIcon2 } from "@/assets/icons/TrashIcon";
import useDisclosure from "@/hooks/useDisclosure";
import { Draggable } from "react-beautiful-dnd";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeLessonAtom,
  courseIdAtom,
  currentCourseAtom,
  lessonAtom,
  lessonModalTypeAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import { deleteLesson, getCourse } from "@/services/lesson.service";
import { lessonTypeText, textFromBg } from "@/lib/constants";
import { toast } from "sonner";
import { typeColorObj } from "../../../[id]/constants";
import Tag from "@/components/shared/tag/tag";
import CreateLessonModal from "../create-lesson-modal/create-lesson-modal";
import { Chip } from "@nextui-org/react";
function PreviewCard({
  lesson,
  index,
  isPractice,
}: {
  lesson: any;
  index: number;
  isPractice: boolean;
}) {
  const currentCourseId = useRecoilValue(courseIdAtom);
  const [currentLesson, setCurrentLesson] = useRecoilState<any>(lessonAtom);
  const [lessonModalType, setLessonModalType] =
    useRecoilState(lessonModalTypeAtom);
  const [currentCourse, setCurrentCourse] =
    useRecoilState<any>(currentCourseAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);

  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreateLessonModal(isPractice);
  const {
    isOpen: isPopoverOpen,
    onOpen: onPopoverOpen,
    onClose: onPopoverClose,
    setIsOpen: setIsPopoverOpen,
  } = useDisclosure();

  const popoverContent = [
    {
      title: "Edit",
      onClick: async () => {
        console.log(lesson);
        setLessonModalType({
          type: "edit",
          lesson,
        });
        setCurrentLesson(lesson);

        onCreateLessonModalOpen();
      },
      icon: EditIcon2,
    },

    {
      title: "Delete",
      onClick: async () => {
        setIsPopoverOpen(false);
        deleteLesson(currentCourseId, lesson.id).then(() => {
          toast.success("Lesson deleted successfully");
          getCourse(currentCourseId).then((res) => {
            setCurrentCourse(res);
            setLessonsArray(res.lessons);
          });
        });
      },
      icon: TrashIcon2,
    },
  ];
  const lastItem = popoverContent[popoverContent.length - 1];

  useEffect(() => {
    if (index === 0) {
      setActiveLesson(0);
    }
  }, []);

  return (
    <>
      <Draggable
        key={(index + 1).toString()}
        draggableId={(index + 1).toString()}
        index={index}
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={` ${
              snapshot.draggingOver ? "shadow-sm bg-gray-50" : ""
            } mb-3`}
          >
            <div
              onClick={() => setActiveLesson(index)}
              key={lesson.id}
              style={{ opacity: lesson.locked ? 0.5 : 1 }}
              className={`flex cursor-pointer items-start relative justify-between gap-2 hover:bg-gray-100 cursor-pointer duration-200 transition-all ease-linear px-4 py-2  rounded-[8px] ${
                activeLesson === index ? "bg-gray-100" : ""
              }`}
            >
              <div className="flex h6-medium items-start gap-2 font-medium">
                <span className="">{index + 1}.</span>
                <div className="flex flex-col gap-2">
                  <div className="capitalize">{lesson.title?.slice(0, 30)}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Chip
                  size="sm"
                  className={`${
                    lesson.type === "avatar"
                      ? "bg-orange-100 text-orange-500 border-orange-500"
                      : "bg-blue-100 text-blue-500 border-blue-500"
                  } text-xs border-1`}
                >
                  {" "}
                  {lessonTypeText[lesson.type]}
                </Chip>
              </div>
            </div>
          </div>
        )}
      </Draggable>
      {isCreateLessonModalOpen && <CreateLessonModal />}
    </>
  );
}

export default PreviewCard;
