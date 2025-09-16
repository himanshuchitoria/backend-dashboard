
function getRandomDoctorImage() {
    const doctorsImages=[
        "https://images.pexels.com/photos/4021801/pexels-photo-4021801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
     
    ]
    const randomIndex = Math.floor(Math.random() * doctorsImages.length);
    return doctorsImages[randomIndex];
}

module.exports=getRandomDoctorImage