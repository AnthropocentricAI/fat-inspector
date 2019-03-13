import React, {PureComponent} from "react";
import TopbarButton from "./topbarbutton.jsx";

const buttonnames = [
    {
        name: "EDIT DATASET",
        dropdowns: [
            {
                name: "Save"
            },
            {
                name: "Export"
            },
            {
                name: "Rename"
            },
            {
                name: "Duplicate"
            },
            {
                name: "Import"
            }
        ]
    },
    {
        name: "NEW DATASET"
    },
    {
        name: "HOW TO USE"
    },
    {
        name: "ABOUT"
    }
];

class Topbar extends PureComponent {
    render() {
        return (
            <div className="topbar">
                <div className="topbar__wrapper">
                    {buttonnames.map(button => (
                        <TopbarButton
                            key={button.name}
                            name={button.name}
                            dropdowns={button.dropdowns}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default Topbar;
