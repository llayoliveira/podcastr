export function convertDurationToTimeString(duration: number) {
    const hours = Math.floor(duration / 3600);//arredonda para o menor número que sobra dessa divisão
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const timeString = [hours, minutes, seconds]
        .map(unit => String(unit).padStart(2, '0')) //adiciona o 0 quando tiver um dígito, para sempre ter 2
        .join(':')

    return timeString;
}
