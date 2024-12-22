const updateTargetPosition = () => {
    const reference = document.getElementById("titleLogo");
    const target = document.getElementById("nameLogo");
    const rect = reference.getBoundingClientRect();

    const refTop = rect.top + window.scrollY - (window.innerWidth <= 768 ? 50 : 70);
    const refLeft = rect.left + window.scrollX;

    target.style.top = `${refTop}px`;
    target.style.left = `${refLeft}px`;
}

window.addEventListener('load', () => {
    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);
});