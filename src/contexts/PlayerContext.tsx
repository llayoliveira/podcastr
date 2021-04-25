import { createContext, useState, ReactNode, useContext } from 'react';
import { Player } from '../components/Player';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[]; //array de episódios
    currentEpisodeIndex: number; //índice do episódio atual (que está tocando)
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void; //void - não retorna nada
    playList: (list: Episode[], index: number) => void; //void - não retorna nada
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleShuffle: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData); //passa como parâmetro o tipo de dados

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]); //quando eu quero alterar uma informação dentro do react e ela vai refletir dentro da interface, tem que usar estados, não pode criar uma variável tradicional direto
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) { //para manipular os valores do estado
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0); //o episódio acima tem que estar tocando no momento
        setIsPlaying(true);
    }

    function playList(list: Episode[], index: number) {
        setEpisodeList(list);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() { //se tiver tocando eu pauso, se tiver pausado eu toco
        setIsPlaying(!isPlaying);
    }

    function toggleLoop() { //se tiver tocando eu pauso, se tiver pausado eu toco
        setIsLooping(!isLooping);
    }

    function toggleShuffle() { //se tiver tocando eu pauso, se tiver pausado eu toco
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function clearPlayerState() {
        setEpisodeList([0]);
        setCurrentEpisodeIndex(0);
    }

    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
    const hasPrevious = currentEpisodeIndex > 0;

    function playNext() {
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)

            setCurrentEpisodeIndex(nextRandomEpisodeIndex);
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                play,
                playList,
                playNext,
                playPrevious,
                isPlaying,
                isLooping,
                isShuffling,
                togglePlay,
                toggleLoop,
                toggleShuffle,
                setPlayingState,
                clearPlayerState,
                hasNext,
                hasPrevious,
            }}
        >
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
    return useContext(PlayerContext); //quando um componete quiser usar o Player, é só escrever usePlayer
}