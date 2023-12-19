"use client";
import { TextField, Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import  { useState } from 'react';

export default function SearchBar({ faqs, setFaqs,initialData }) {
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
  
    if (value === '') {
      setFaqs(initialData);
    } else {
      const searchWords = value.toLowerCase().split(' ');
  
      const filterQuestions = faqs.filter(quest => {
        const questionWords = quest.title.toLowerCase().split(' ');
  
        for (const word of searchWords) {
          if (!questionWords.some(questionWord => questionWord.includes(word))) {
            return false;
          }
        }
        return true;
      });
  
      setFaqs(filterQuestions);
    }
  };
  
  return (
    <Box sx={{ display: "flex", padding: "0.5rem", margin:'5rem'}}>
      <IconButton type="submit" aria-label="search">
        <SearchIcon style={{ fill: "rgb(51,87,155)" }} />
      </IconButton>
      <TextField
        fullWidth
        id="outlined-basic"
        placeholder="Search..."
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
      />
    </Box>
  );
}
