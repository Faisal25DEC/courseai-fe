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
            }`}
          >
            <div
              className={`flex justify-center items-center ${
                activeLesson === index
                  ? "border-2 border-pink-200"
                  : "border-1 border-gray-300"
              } w-full h-[150px] rounded-lg mb-3 relative cursor-pointer shadow-md`}
              onClick={() => {
                setActiveLesson(index);
              }}
            >
              <p className="absolute w-[100px] top-2 left-2 text-gray-700 font-semibold capitalize text-sm truncate">
                {lesson.title}
              </p>

              {/* <Tag
                color={textFromBg[typeColorObj[lesson.type]]}
                bg={typeColorObj[lesson.type]}
              >
                {lessonTypeText[lesson.type]}
              </Tag> */}
              <Icon
                icon="ph:text-align-left-duotone"
                className="w-[160px] h-[100px] text-gray-300"
              />

              <p className="start-gradient absolute bottom-3 left-3 bg-pink-300 text-white flex items-center  px-3 py-1 rounded-full leading-0 cursor-pointer text-md">
                {index + 1}
              </p>
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <CustomPopover
                  open={isPopoverOpen}
                  onOpenChange={setIsPopoverOpen}
                  align="end"
                  className="p-0 w-[fit-content] min-w-[150px] shadow-2 rounded-[8px]"
                  trigger={
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        isPopoverOpen ? onPopoverClose() : onPopoverOpen();
                      }}
                    >
                      <Icon
                        className="w-6 h-6 text-gray-700"
                        icon="pepicons-pencil:dots-y"
                      />
                    </div>
                  }
                >
                  <div className="p-2 flex flex-col gap-[0px] ">
                    {popoverContent
                      .slice(0, popoverContent.length - 1)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          onClick={item.onClick}
                          className="text-gray-500 hover:text-gray-700  cursor-pointer flex p-[6px] px-2 gap-[6px] w-[100%] items-center hover:bg-gray-100 rounded-md transition-all font-medium duration-200 ease-in"
                        >
                          <div>
                            <item.icon />
                          </div>
                          <p className="text-[14px] cursor-pointer">
                            {item.title}
                          </p>
                        </div>
                      ))}
                    <div
                      onClick={lastItem.onClick}
                      className="text-red-500 cursor-pointer flex p-[6px] gap-[6px] w-full items-center hover:bg-red-500 hover:text-white rounded-md transition-all duration-200 ease-in"
                    >
                      <div>
                        <lastItem.icon />
                      </div>
                      <p className="text-[14px]  font-medium cursor-pointer">
                        {lastItem.title}
                      </p>
                    </div>
                  </div>
                </CustomPopover>
              </div>
            </div>
            {/* <div className="relative w-full mt-6 my-2">
              <hr className="relative" />
              <div onClick={() => onCreateLessonModalOpen()}>
                <Icon
                  icon="gg:add"
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-gray-700 cursor-pointer"
                />
              </div>
            </div> */}
          </div>
        )}
      </Draggable>
      {isCreateLessonModalOpen && <CreateLessonModal />}
    </>
  );
}

export default PreviewCard;
