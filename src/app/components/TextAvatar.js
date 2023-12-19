import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function TextAvatar({ name, imageUrl }) {

  const getInitials = () => {
    return name[0] + name[name.indexOf(" ") + 1];
  };

  return <Box sx={{ paddingTop: 8}}>
    <Avatar sx={{ width: 160, height: 160, backgroundColor: '#E4D8D8', marginTop: '2rem' }}>
      {imageUrl ? (
        <img src={imageUrl} alt={<Typography variant="h2" sx={{ color: '#98436C' }}>{getInitials()}</Typography>} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
      ) : (
        <Typography variant="h2" sx={{ color: '#98436C' }}>
          {getInitials()}
        </Typography>
      )}
    </Avatar>
  </Box>
}
