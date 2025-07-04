import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function AboutUs() {
  const handleClick = () => {
    // console.log('About Us button clicked');
    window.open(
      'https://sites.google.com/view/f4thuduc/giới-thiệu', // Use decoded or correct URL
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <Box>
    {/* <Button
        id="basic-button-started"
        onClick={handleClick} // Changed from () => handleClick
        sx={{
          fontSize: 14,
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        About Us
      </Button> */}
    </Box>
  );
}

export default AboutUs;
