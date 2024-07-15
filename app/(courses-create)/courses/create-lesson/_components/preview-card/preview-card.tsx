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
      icon: <Icon icon="ic:baseline-edit" />,
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
      icon: <Icon icon="fluent:delete-16-filled" />,
    },
  ];

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
            className={`${snapshot.draggingOver ? "shadow-sm bg-gray-50" : ""}`}
          >
            <div
              onClick={() => setActiveLesson(index)}
              key={lesson.id}
              style={{ opacity: lesson.locked ? 0.5 : 1 }}
              className={`flex cursor-pointer items-start relative justify-between transition-all ease-linear px-4 py-4 text-white border-b-1 border-gray-600 ${
                activeLesson === index
                  ? "bg-black border-l-5 border-l-white"
                  : ""
              }`}
            >
              <div className="flex h6-medium items-start gap-2 font-medium relative">
                <span className="text-gray-300">{index + 1}.</span>
                <div className="flex flex-col gap-2 w-full">
                  <div className="capitalize text-gray-300">
                    <span
                      className="block overflow-wrap break-words whitespace-normal w-[80%]"
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {lesson.title}
                    </span>
                    <p
                      className={`${
                        lesson.type === "avatar"
                          ? "text-orange-200"
                          : "text-blue-200"
                      } text-xs`}
                    >
                      {lessonTypeText[lesson.type]}
                    </p>
                  </div>
                </div>
              
              </div>
              <div>
                <CustomPopover
                  className={"w-fit p-0 ml-12 mt-4 absolute right-4"}
                  align="end"
                  open={isPopoverOpen}
                  onOpenChange={setIsPopoverOpen}
                  trigger={
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        isPopoverOpen ? onPopoverClose() : onPopoverOpen();
                      }}
                    >
                      <Icon
                        className="w-5 text-white h-5 absolute top-5 right-4"
                        icon="pepicons-pencil:dots-y"
                      />
                    </div>
                  }
                >
                  {popoverContent.map((item: any, idx: number) => {
                    return (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onClick();
                          onPopoverClose();
                        }}
                        className="text-gray-500 hover:text-gray-700  cursor-pointer flex py-[8px] px-[12px] gap-[6px] w-[100%] items-center hover:bg-gray-100 rounded-md transition-all font-medium duration-200 ease-in"
                      >
                        <div>{item.icon}</div>
                        <p className="text-[14px] cursor-pointer">
                          {item.title}
                        </p>
                      </div>
                    );
                  })}
                </CustomPopover>
                </div>
            </div>
          </div>
        )}
      </Draggable>
      {/* {isCreateLessonModalOpen && <CreateLessonModal />} */}
    </>
  );
}

export default PreviewCard;
