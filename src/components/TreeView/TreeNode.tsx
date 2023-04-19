import { useSignal } from '@preact/signals';

type props = {
    label: string;
    description?: string | null;
    children?: JSX.Element | JSX.Element[];
};

const TreeNode = ({ label, description, children }: props) => {
    return (
        <div className="pl-4 pb-3">
            <div className="flex items-center">
                {/* <div className={`w-3 h-3 mr-3 rounded-full bg-gray-900`}></div> */}
                <div className="text-gray-900 font-medium">{label}</div>
                {description ? (
                    <span className="ml-1 before:content-[':'] before:mr-2">
                        {description}
                    </span>
                ) : (
                    ''
                )}
            </div>
            <div className="pl-6">{children}</div>
        </div>
    );
};

export default TreeNode;
