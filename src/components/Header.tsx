interface props {
    title: string;
    version: string;
}

const Header = ({ title, version }: props) => {
    return (
        <header className="border-b border-gray-500 pb-2 grid grid-cols-2 gap-x-40">
            <div className="col-auto">
                <h2 className="font-bold">{title}</h2>
                <span className="text-xs antialiased text-gray-600">
                    v{version}
                </span>
            </div>
            <div className="col-auto" id="info-contact-section">
                <h2 className="text-gray-500">Made By : FP</h2>
            </div>
        </header>
    );
};

export default Header;
