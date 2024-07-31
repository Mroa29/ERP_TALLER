document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.getElementById('clearButton');
    const saveButton = document.getElementById('saveButton');
    const savedSignature = document.getElementById('savedSignature');
    let isDrawing = false;
    
    // Ajustar el tamaño del canvas
    function resizeCanvas() {
      const dataURL = canvas.toDataURL();
      canvas.width = canvas.clientWidth;
      canvas.height = 200;
      const img = new Image();
      img.src = dataURL;
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
      };
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Comenzar a dibujar
    canvas.addEventListener('mousedown', function(e) {
      isDrawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });
    
    // Dibujar
    canvas.addEventListener('mousemove', function(e) {
      if (isDrawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }
    });
    
    // Detener el dibujo
    canvas.addEventListener('mouseup', function() {
      isDrawing = false;
    });
    
    // Limpiar el canvas
    clearButton.addEventListener('click', function() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // Guardar la firma
    saveButton.addEventListener('click', function() {
      const dataURL = canvas.toDataURL();
      savedSignature.src = dataURL;
    });
  });