
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white">
            <div className="container mx-auto px-4 py-8">
                <p className="text-xs text-gray-500 text-center">
                    Trademarks, trade names and logos displayed are registered trademarks of their respective owners. No affiliation or endorsement of GlobalRemit should be implied.
                </p>
                <p className="text-xs text-gray-500 text-center mt-4">
                    © {new Date().getFullYear()} GlobalRemit. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
};

export default Footer;