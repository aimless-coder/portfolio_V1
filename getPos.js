const updateTargetPosition = () => {
    const reference = document.getElementById("titleLogo");
    const target = document.getElementById("nameLogo");
    const rect = reference.getBoundingClientRect();

    const refTop = rect.top - 70;  
    const refLeft = rect.left; 

    target.style.top = `${refTop}px`;
    target.style.left = `${refLeft}px`;
}
window.addEventListener('load', () => {
    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
});