import { EditIcon2 } from "@/assets/icons/EditIcon";
import { TrashIcon2 } from "@/assets/icons/TrashIcon";
import CustomPopover from "@/components/shared/custom-popover/custom-popover";
import useDisclosure from "@/hooks/useDisclosure";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Draggable } from "react-beautiful-dnd";
import useCreateLessonModal from "@/hooks/useCreateLessonModal";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeLessonAtom,
  courseIdAtom,
  currentCourseAtom,
  currentUserRoleAtom,
  lessonAtom,
  lessonModalTypeAtom,
  lessonsArrayAtom,
} from "@/store/atoms";
import { deleteLesson, getCourse } from "@/services/lesson.service";
import { admin, lessonTypeText, textFromBg } from "@/lib/constants";
import { toast } from "sonner";

import Tag from "@/components/shared/tag/tag";
import { Avatar, Chip } from "@nextui-org/react";
import useCreatePracticeLessonModal from "@/hooks/useCreatePracticeLessonModal";
const PracticeCard = ({
  lesson,
  index,
  isPractice,
}: {
  lesson: any;
  index: number;
  isPractice: boolean;
}) => {
  // const currentCourseId = useRecoilValue(courseIdAtom);
  const currentCourseId = "6667760f255b05556e58b41a";
  
  const [currentLesson, setCurrentLesson] = useRecoilState<any>(lessonAtom);
  const [lessonModalType, setLessonModalType] =
    useRecoilState(lessonModalTypeAtom);
  const [currentCourse, setCurrentCourse] =
    useRecoilState<any>(currentCourseAtom);
  const [lessonsArray, setLessonsArray] = useRecoilState<any>(lessonsArrayAtom);
  const [activeLesson, setActiveLesson] = useRecoilState(activeLessonAtom);
  const [randomNumber, setRandomNumber] = useState(0);

  const [currentUserRole, setCurrentUserRole] =
    useRecoilState(currentUserRoleAtom);

  useEffect(() => {
    const generateRandomNumber = () => {
      return Math.floor(Math.random() * 60) + 1;
    };

    setRandomNumber(generateRandomNumber());
  }, []);

  const {
    isOpen: isCreateLessonModalOpen,
    onOpen: onCreateLessonModalOpen,
    onClose: onCreateLessonModalClose,
  } = useCreatePracticeLessonModal();

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
    // #TODO: temp fix until practice table is separated from course
    if (index === 9) setActiveLesson(index);

    console.log("active lesson in practice ", activeLesson, index);
  }, []);

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
          className={`w-full items-baseline relative flex gap-5 border rounded-lg ${
            activeLesson === index ? "border-gray-700 bg-[#FBFBFB]" : "bg-white"
          } ${snapshot.draggingOver ? "shadow-sm bg-gray-50" : ""}`}
          onClick={() => {
            setActiveLesson(index);
          }}
        >
          <div className="w-full px-5 p-4 rounded-[10px] shadow-1 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* <Icon icon="ri:draggable" className="" /> */}

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-start gap-5">
                    <div className="relative">
                      <Avatar
                        isBordered
                        radius="full"
                        size="md"
                        src={lesson.content.avatar.normal_thumbnail_small}
                      />
                      <Icon
                        icon="fluent-emoji-flat:green-circle"
                        className="w-4 h-4 bg-white border-2 border-white rounded-full absolute -bottom-2 right-0"
                      />
                    </div>
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h4 className="text-small font-semibold leading-none text-default-600">
                        {lesson.title}
                      </h4>
                      <h5 className="text-small w-[280px] tracking-tight text-default-400 whitespace-nowrap overflow-hidden text-ellipsis">
                        {lesson.description}
                      </h5>

                      <div className="flex mt-3">
                        <div className="bg-gray-100 px-2 py-[2px] text-xs rounded-lg font-semibold">
                          {" "}
                          {lessonTypeText[lesson.type]}
                        </div>
                        <div className="ml-2 border px-2 py-[2px] text-xs rounded-lg font-semibold">
                          {" "}
                          {lesson.content.voice.display_name.split("-")[1]}
                        </div>
                      </div>
                      <div className="mt-2 border px-2 py-[2px] text-xs rounded-lg font-semibold bg-black text-white">
                        {" "}
                        Book rate : {randomNumber}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {currentUserRole === admin && (
              <div className="flex items-center gap-2">
                <CustomPopover
                  open={isPopoverOpen}
                  onOpenChange={setIsPopoverOpen}
                  align="end"
                  className="p-0 absolute -top-8 w-[fit-content] min-w-[150px] shadow-2 rounded-[8px]"
                  trigger={
                    <div
                      className="absolute top-3 right-2"
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
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default PracticeCard;
