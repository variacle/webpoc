setwd("/Users/cgmeixide/Dropbox")

set.seed(111)
# Correct pixel definitions for all letters
letter_V <- matrix(c(
  1,0,0,0,1,
  1,0,0,0,1,
  1,0,0,0,1,
  0,1,0,1,0,
  0,1,0,1,0,
  0,1,0,1,0,
  0,0,1,0,0
  
), nrow = 7, byrow = TRUE)

letter_A <- matrix(c(
  0,1,1,1,0,
  1,0,0,0,1,
  1,0,0,0,1,
  1,1,1,1,1,
  1,0,0,0,1,
  1,0,0,0,1,
  1,0,0,0,1
), nrow = 7, byrow = TRUE)

letter_R <- matrix(c(
  1,1,1,1,0,
  1,0,0,0,1,
  1,0,0,0,1,
  1,1,1,1,0,
  1,0,1,0,0,
  1,0,0,1,0,
  1,0,0,0,1
), nrow = 7, byrow = TRUE)

letter_I <- matrix(c(
  1,1,1,
  0,1,0,
  0,1,0,
  0,1,0,
  0,1,0,
  0,1,0,
  1,1,1
), nrow = 7, byrow = TRUE)

letter_C <- matrix(c(
  0,1,1,1,
  1,0,0,0,
  1,0,0,0,
  1,0,0,0,
  1,0,0,0,
  1,0,0,0,
  0,1,1,1
), nrow = 7, byrow = TRUE)

letter_L <- matrix(c(
  1,0,0,0,
  1,0,0,0,
  1,0,0,0,
  1,0,0,0,
  1,0,0,0,
  1,0,0,0,
  1,1,1,1
), nrow = 7, byrow = TRUE)

letter_E <- matrix(c(
  1,1,1,1,
  1,0,0,0,
  1,0,0,0,
  1,1,1,1,
  1,0,0,0,
  1,0,0,0,
  1,1,1,1
), nrow = 7, byrow = TRUE)

# Scaling function
scale_up <- function(mat, fac) {
  kronecker(mat, matrix(1, fac, fac))
}

# Scale factor
fac <- 2

# Scale letters
V2 <- scale_up(letter_V, fac)
A2 <- scale_up(letter_A, fac)
R2 <- scale_up(letter_R, fac)
I2 <- scale_up(letter_I, fac)
C2 <- scale_up(letter_C, fac)
L2 <- scale_up(letter_L, fac)
E2 <- scale_up(letter_E, fac)

# Add a 1-column blank matrix for spacing
space <- matrix(0, nrow = 7 * fac, ncol = fac)

# Build the list of letters and spaces
letters_list <- list(V2, space, A2, space, R2, space, I2, space, A2, space, C2, space, L2, space, E2)

# Total width and canvas
total_width <- sum(sapply(letters_list, ncol))
height <- nrow(V2)
n_row <- height + 20
n_col <- total_width + 10
mat <- matrix(0, nrow = n_row, ncol = n_col)

# Drawing function
draw_letter <- function(letter, mat, row, col) {
  nr <- nrow(letter)
  nc <- ncol(letter)
  mat[row:(row + nr - 1), col:(col + nc - 1)] <- 
    mat[row:(row + nr - 1), col:(col + nc - 1)] | letter
  return(mat)
}

# Draw letters and spaces
current_col <- 2
for (let in letters_list) {
  mat <- draw_letter(let, mat, 10, current_col)
  current_col <- current_col + ncol(let)
}
# Dropout mask: only apply dropout to letter pixels (mat == 1)
drop_mask <- matrix(rbinom(n_row * n_col, 1, prob = 0.85), nrow = n_row)

# Initialize display matrix
mat_display <- mat  # Start with original

# Set dropped letter pixels to 2
mat_display[mat == 1 & drop_mask == 0] <- 2

# Set preserved letter pixels to 1 (just to be safe)
mat_display[mat == 1 & drop_mask == 1] <- 1

png("/Users/cgmeixide/Projects/logo_front.png", width = 1600, height = 400, bg = "transparent",  res = 800)

par(mar = c(0, 0, 0, 0))
image(
  1:n_col, 1:n_row, t(apply(mat_display, 2, rev)),
  col = c(NA, "#c678dd", "NA"),  # NA means fully transparent
  axes = FALSE, xlab = "", ylab = "", useRaster = TRUE,
  asp = 1
)

dev.off()
