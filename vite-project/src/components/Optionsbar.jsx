import './OptionsBar.css'

const Optionsbar = (buttonActive) => {
    // console.log(buttonActive.buttonActive);

    return (
        <div
            className={`barra-opcoes ${buttonActive.buttonActive ? "active" : "inactive"}`}
        >
            <a>Propriedades Salvas</a>
            <a>Adcionar propriedades</a>
        </div>
    )
}

export default Optionsbar;