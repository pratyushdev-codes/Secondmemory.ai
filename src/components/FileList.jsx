// import React from 'react';
// import { File, MoreVertical } from 'lucide-react';

// export function FileList({ files }) {
//   if (files.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-4 text-center">
//         <div className="bg-gray-800 rounded-full p-2 mb-1">
//         <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/></svg>
//         </div>
//         <p className="text-white">You have not added a file yet</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       {files.map((file, index) => (
//         <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
//           <div className="flex items-center gap-3">
//             <File className="w-5 h-5 text-gray-400" />
//             <span className="text-gray-300">{file.name}</span>
//           </div>
//           <button className="p-1 hover:bg-gray-700 rounded-full">
//             <MoreVertical className="w-4 h-4 text-gray-400" />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
import React from 'react';
import { File, MoreVertical, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function FileList({ files, isUploading }) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-center">
        <div className="bg-gray-800 rounded-full p-2 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9">
            <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z"/>
          </svg>
        </div>
        <p className="text-white">You have not added a file yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file, index) => (
        <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3 flex-1">
            <File className="w-5 h-5 text-gray-400" />
            <div className="flex flex-col flex-1">
              <span className="text-gray-300">{file.name}</span>
              <div className="text-sm">
                {file.status === 'processed' && (
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {`Processed ${file.chunks} chunks`}
                  </span>
                )}
                {file.status === 'error' && (
                  <span className="text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Processing failed
                  </span>
                )}
                {!file.status && isUploading && (
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-700 rounded-full">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
}