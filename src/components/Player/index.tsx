import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import Episode from '../../pages/episodes/[slug]';

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null); //armazenando um elemento de audio do HTML

    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        clearPlayerState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current) {//current = valor da referência
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]) //função dispara toda vez que o isPlaying tiver o seu valor alterado

    function setupProgressListener() {
        audioRef.current.currentTime = 0; //sempre que mudar de um audio para outro, volta ele para 0

        audioRef.current.addEventListener('timeupdate', () => { //timeupdate = disparado várias vezes enquanto nosso áudio está tocando
            setProgress(Math.floor(audioRef.current.currentTime)); //retorna o tempo atual do player
        });
    }

    function handleSeek(amount: number) { //recebe como parâmetro o número da duração que a pessoa arrastou a bolinha
        audioRef.current.currentTime = amount; //troca o áudio
        setProgress(amount); //troca a variável progresso
    }

    function handleEpisodeEnded() {
        if (hasNext) { //se tiver um próximo audio
            playNext() //toca o próximo
        } else { //se não
            clearPlayerState() //limpa o estado
        }
    }

    const episode = episodeList[currentEpisodeIndex];

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration} //valor máximo que ele pode chegar
                                value={progress}
                                onChange={handleSeek}//o que acontece quando o usuário arrasta a bolinha
                                trackStyle={{ backgroundColor: '#04D361' }} //parte que já sofreu progresso
                                railStyle={{ backgroundColor: '#9F75FF' }} //cor da parte que falta tocar
                                handleStyle={{ borderColor: '#04D361', borderWidth: 4 }} //cor fda bolinha
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                {episode && ( //(episode?.duration ?? 0) - ponto de interrogação, pois se o episódio não existir, ele não vai tentar acessar o duration // ?? 0 => e passa o valor 0 como padrão
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay //assim que clicar no play, já tem que tocar
                        onEnded={handleEpisodeEnded}
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}//dispara assim que o Player conseguir carregar os dados do episódio
                    />
                )}

                <div className={styles.buttons}>
                    <button
                        type="button"
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying
                            ? <img src="/pause.svg" alt="Tocar" />
                            : <img src="/play.svg" alt="Tocar" />}
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>

            </footer>
        </div >
    );
}