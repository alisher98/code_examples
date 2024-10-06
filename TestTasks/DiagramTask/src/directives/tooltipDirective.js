const tooltipDirective = {
  mounted(el, binding) {
    // Создаем контейнер для подсказки
    const tooltip = document.createElement('div');
    tooltip.textContent = binding.value;
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    // Позиционируем подсказку при наведении
    const showTooltip = () => {
      tooltip.style.display = 'block';
      const rect = el.getBoundingClientRect();
      tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`; // Над элементом
      tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`; // По центру
    };

    const hideTooltip = () => {
      tooltip.style.display = 'none';
    };

    el.addEventListener('mouseenter', showTooltip);
    el.addEventListener('mouseleave', hideTooltip);

    el._tooltip = tooltip; // Сохраняем ссылку на подсказку
  },
  unmounted(el) {
    // Удаляем подсказку при удалении элемента
    document.body.removeChild(el._tooltip);
  }
};

export default tooltipDirective;