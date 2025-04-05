import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (FILE: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "images/*": [".png", ".jpg", ".svg"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col justify-center items-center bg-[#101012] rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 ">
            <img
              src={fileUrl}
              alt="img"
              className="h-80 lg:h-[480px] w-full rounded-[24px] object-cover object-top"
            />
          </div>
          <p className="text-[#5C5C7B] text-center text-[14px] font-normal leading-[140%] w-full p-4 border-t border-t-[#49494a] ">
            Click or drag photo to replace
          </p>
        </>
      ) : (
        <div className=" flex justify-center items-center flex-col p-7 h-80 lg:h-[612px] ">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file-upload"
            width={96}
            height={77}
          />
          <h3 className="text-[16px] font-medium leading-[140%] mb-2 mt-6 text-[#EFEFEF]">
            Drag photo here
          </h3>
          <p className="text-[#5C5C7B] text-[14px] font-normal leading-[140%] mb-6 ">
            SVG, PNG, JPG
          </p>
          <Button
            type="button"
            className=" bg-[#1F1F22] p-5 text-[#FFFFFF] flex gap-2 !important"
          >
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
