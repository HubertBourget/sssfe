import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
    const { searchQuery } = useParams(); // Extract searchQuery from URL
    const [searchResults, setSearchResults] = useState({ tracks: [], albums: [], artists: [] });
    const [isLoading, setIsLoading] = useState(true);

    // Simulate obtaining userId from Auth0 or another auth service
    // Replace this with your actual method of obtaining the userId
    const userId = 'your_user_id_from_auth_service';

    useEffect(() => {
        if (!searchQuery) return;

        const fetchSearchResults = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://monkfish-app-nb3ck.ondigitalocean.app/api/getSearchResult`, {
                    params: { userId, searchQuery }
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error('Failed to fetch search results:', error);
                // Handle error as appropriate for your application
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery, userId]);

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Search Results for "{searchQuery}"</h2>
            <div>
                <h3>Tracks</h3>
                <ul>
                    {searchResults.tracks.map((track, index) => (
                        <li key={index}>{track.itemName} - {track.score}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Albums</h3>
                <ul>
                    {searchResults.albums.map((album, index) => (
                        <li key={index}>{album.itemName} - {album.score}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Artists</h3>
                <ul>
                    {searchResults.artists.map((artist, index) => (
                        <li key={index}>{artist.itemName} - {artist.score}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Search;
