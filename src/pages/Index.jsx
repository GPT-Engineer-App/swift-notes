import React, { useState } from "react";
import { Box, Button, Container, Flex, Heading, Input, List, ListItem, Textarea, useColorMode, IconButton, useColorModeValue } from "@chakra-ui/react";
import { FaSun, FaMoon, FaTrash, FaPen, FaPlus } from "react-icons/fa";

// A basic markdown to HTML conversion function
function markdownToHTML(markdown) {
  if (!markdown) return "";
  return markdown
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
    .replace(/\*(.*)\*/gim, "<i>$1</i>")
    .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/\n$/gim, "<br />");
}

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const formBackground = useColorModeValue("gray.100", "gray.700");

  const handleNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: "New Note",
      content: "",
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
    setEditing(true);
  };

  const handleSelectNote = (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    setActiveNote(noteId);
    setTitle(note.title);
    setContent(note.content);
    setEditing(false);
  };

  const handleSaveNote = () => {
    setNotes(notes.map((note) => (note.id === activeNote ? { ...note, title, content } : note)));
    setEditing(false);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    if (activeNote === noteId) {
      setActiveNote(null);
      setTitle("");
      setContent("");
    }
  };

  const handleChangeTitle = (e) => setTitle(e.target.value);
  const handleChangeContent = (e) => setContent(e.target.value);

  return (
    <Container maxW="container.md" p={4}>
      <Flex justifyContent="space-between" mb={4}>
        <Heading mb={6}>Notes</Heading>
        <IconButton icon={colorMode === "light" ? <FaMoon /> : <FaSun />} onClick={toggleColorMode} variant="ghost" />
      </Flex>
      <Flex>
        <Box w="30%" pr={2}>
          <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={handleNewNote}>
            New Note
          </Button>
          <List spacing={3} mt={2} maxHeight="80vh" overflowY="auto">
            {notes.map((note) => (
              <ListItem key={note.id} p={2} bg={activeNote === note.id ? "teal.500" : formBackground} borderRadius="md" onClick={() => handleSelectNote(note.id)} _hover={{ bg: "teal.300", cursor: "pointer" }}>
                <Flex justifyContent="space-between">
                  <Text fontWeight="bold" color={activeNote === note.id ? "white" : "black"}>
                    {note.title}
                  </Text>
                  <IconButton
                    icon={<FaTrash />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNote(note.id);
                    }}
                  />
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box w="70%" pl={2} bg={formBackground} p={4} borderRadius="md">
          {activeNote && (
            <>
              {!editing ? (
                <>
                  <Heading mb={2} size="lg">
                    {title}
                  </Heading>
                  <div dangerouslySetInnerHTML={{ __html: markdownToHTML(content) }} style={{ whiteSpace: "pre-wrap" }}></div>
                  <IconButton icon={<FaPen />} size="sm" colorScheme="yellow" variant="ghost" mt={2} onClick={() => setEditing(true)} />
                </>
              ) : (
                <>
                  <Input placeholder="Note title" mb={2} value={title} onChange={handleChangeTitle} />
                  <Textarea placeholder="Note content" value={content} onChange={handleChangeContent} height="70vh" />
                  <Button mt={2} colorScheme="blue" onClick={handleSaveNote}>
                    Save
                  </Button>
                </>
              )}
            </>
          )}
        </Box>
      </Flex>
    </Container>
  );
};

export default Index;
