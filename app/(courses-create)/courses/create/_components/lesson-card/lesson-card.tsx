import { EditIcon2 } from "@/assets/icons/EditIcon";
import { TrashIcon2 } from "@/assets/icons/TrashIcon";
import CustomPopover from "@/components/shared/custom-popover/custom-popover";
import useDisclosure from "@/hooks/useDisclosure";
import React from "react";
import { Icon } from "@iconify/react";
import { Draggable } from "react-beautiful-dnd";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import { useRecoilState } from "recoil";
import {
  currentCourseAtom,
  lessonAtom,
  lessonModalTypeAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import { deleteLesson, getCourse } from "@/services/lesson.service";
import { currentCourseId } from "@/lib/constants";
const LessonCard = ({ lesson, index }: { lesson: any; index: number }) => {
  const [currentLesson, setCurrentLesson] = useRecoilState<any>(lessonAtom);
  const [lessonModalType, setLessonModalType] =
    useRecoilState(lessonModalTypeAtom);
  const [currentCourse, setCurrentCourse] =
    useRecoilState<any>(currentCourseAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreateLessonModal();
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

        onCreateLessonModalOpen();
      },
      icon: EditIcon2,
    },

    {
      title: "Delete",
      onClick: async () => {
        deleteLesson(currentCourseId, lesson.id).then(() => {
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
  return (
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
          className={`w-full items-baseline relative flex gap-5 ${
            snapshot.draggingOver ? "shadow-sm bg-gray-50" : ""
          }`}
        >
          <div className="w-full p-4 rounded-[10px] shadow-1 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-normal text-gray-600">
                    {lesson.title}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">{lesson.description}</p>
              </div>
              {/* <div>
        <p className="text-sm text-gray-400">Type : {lesson.type}</p>
      </div> */}
            </div>
            <div>
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
                    <Icon className="w-6 h-6" icon="pepicons-pencil:dots-y" />
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
        </div>
      )}
    </Draggable>
  );
};

export default LessonCard;
