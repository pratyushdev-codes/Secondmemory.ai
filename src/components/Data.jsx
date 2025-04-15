import {
  MoreVertical,
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Image,
  Globe,
  Layers,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import firebaseapp from './firebaseConfig';
import { Toaster, toast } from 'react-hot-toast';

const Data = () => {
  const [treeData, setTreeData] = useState([
    {
      name: 'In-built Memory',
      type: 'folder',
      children: [
        { name: 'Arx-iv', type: 'file', fileType: 'text' },
        { name: 'Wikipedia', type: 'file', fileType: 'website' },
        { name: 'Google News', type: 'file', fileType: 'website' },
      ],
    },
    {
      name: 'Documents',
      type: 'folder',
      children: [], // Will be populated from Firebase
    },
    {
      name: 'Website',
      type: 'folder',
      children: [], // Will be populated from Firebase
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      
    }, 10000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchData = async () => {
    try {
      const db = getDatabase(firebaseapp);

      // Fetch website data
      const websiteRef = ref(db, '/websiteData');
      const websiteSnapshot = await get(websiteRef);

      // Fetch document data
      const documentRef = ref(db, '/pdfDocuments');
      const documentSnapshot = await get(documentRef);

      // Update tree data with fetched data
      setTreeData((prevData) => {
        const newData = [...prevData];

        // Update Documents folder
        if (documentSnapshot.exists()) {
          const documentData = Object.entries(documentSnapshot.val()).map(
            ([key, value]) => ({
              name: value.fileName || key,
              type: 'file',
              fileType: 'text',
            })
          );
          newData[1].children = documentData;
        }

        // Update Website folder
        if (websiteSnapshot.exists()) {
          const websiteData = Object.entries(websiteSnapshot.val()).map(
            ([key, value]) => ({
              name: value.url || key,
              type: 'file',
              fileType: 'website',
            })
          );
          newData[2].children = websiteData;
        }

        return newData;
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getIcon = (node) => {
    if (node.type === 'folder') {
      return <Folder className="shrink-0 size-4 text-gray-500" />;
    }
    if (node.name === 'Arx-iv') {
      return <Layers className="shrink-0 size-4 text-gray-500" />;
    }
    if (node.name === 'Google News') {
      return <i className="fa-solid fa-newspaper shrink-0 size-4 text-gray-500" />;
    }
    if (node.fileType === 'image') {
      return <Image className="shrink-0 size-4 text-gray-500" />;
    }
    if (node.fileType === 'website') {
      return <Globe className="shrink-0 size-4 text-gray-500" />;
    }
    return <FileText className="shrink-0 size-4 text-gray-500" />;
  };

  const TreeNode = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(
      level === 0 || node.name === 'Documents' || node.name === 'Website'
    );

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div role="treeitem" aria-expanded={isOpen}>
        <div className="py-0.5 flex items-center gap-x-0.5 w-full">
          {node.type === 'folder' && (
            <button
              onClick={handleToggle}
              className="size-6 flex justify-center items-center hover:bg-gray-100 rounded-md focus:outline-none focus:bg-gray-100"
            >
              {isOpen ? (
                <ChevronDown className="size-4 text-blue-400" />
              ) : (
                <ChevronRight className="size-4 text-blue-600" />
              )}
            </button>
          )}
          {node.type === 'file' && <div className="size-6" />}
          <div className="grow px-1.5 rounded-md cursor-pointer hover:bg-gray-100">
            <div className="flex items-center gap-x-3">
              {getIcon(node)}
              <div className="grow">
                <span className="text-sm text-gray-400">{node.name}</span>
              </div>
            </div>
          </div>
        </div>
        {node.type === 'folder' && isOpen && node.children && (
          <div className="ms-6 ps-3 relative before:absolute before:top-0 before:start-3 before:w-px before:h-full before:bg-gray-100">
            {node.children.map((child, index) => (
              <TreeNode key={index} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-gamepad text-white"></i>
            <h2 className="text-lg font-medium text-gray-200">Your Knowledge Base</h2>
          </div>
          <button className="text-gray-400 hover:text-cyan-400 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        <div className="mt-2 scrollbar-invisible" style={{ maxHeight: "80vh", overflow: "auto" }}>
          <div className="flex items-center justify-between">
            <div className="hs-accordion-treeview-root" role="tree" aria-orientation="vertical">
              {treeData.map((node, index) => (
                <TreeNode key={index} node={node} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
